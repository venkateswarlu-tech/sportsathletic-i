import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [videoUri, setVideoUri] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  // Request camera roll permissions when the app loads
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Pick a video from the media library
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.cancelled) {
      setVideoUri(result.uri);
    }
  };

  // Upload the video to the server
  const uploadVideo = async () => {
    if (!videoUri) return;

    try {
      const videoInfo = await FileSystem.readAsStringAsync(videoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'upload.mp4',
      });

      const response = await fetch('http://<YOUR_SERVER_IP>:5000/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      setFeedback(result.feedback); // Assume the server returns a 'feedback' field
    } catch (error) {
      setFeedback('Error uploading video');
    }
  };

  // If permissions are not granted, show an error message
  if (hasPermission === false) {
    return <Text>No access to media library</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Pick a Training Video" onPress={pickVideo} />
      {videoUri && <Text>Video Selected</Text>}
      <Button title="Upload & Analyze" onPress={uploadVideo} disabled={!videoUri} />
      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  feedback: { marginTop: 20, fontSize: 16, color: 'green' },
});
