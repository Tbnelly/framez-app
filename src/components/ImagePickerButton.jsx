import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerButton({ onPick }) {
  const pick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to allow access to your media library.');
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Send the first picked image URI to the parent
      onPick(result.assets[0].uri);
    }
  };

  return <Button title="Pick Image" onPress={pick} />;
}
