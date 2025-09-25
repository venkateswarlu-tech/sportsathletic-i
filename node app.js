import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const mongodb_url = "mongodb+srv://cluster0.kqvbnpb.mongodb.net/"
"

export default function App() {
  const [videoUri, setVideoUri] = useState(null);
  const [feedback, setFeedback] = useState('');

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.cancelled) {
      setVideoUri(result.uri);
    }
  };

  const uploadVideo = async () => {
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
    setFeedback(result.feedback);
  };

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

