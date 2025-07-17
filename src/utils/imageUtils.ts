import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressedImage {
  blob: Blob;
  size: number;
  uri: string;
}

export async function compressImage(imageUri: string): Promise<CompressedImage> {
  const compressed = await ImageManipulator.manipulateAsync(
    imageUri,
    [],
    { compress: 0.05, format: ImageManipulator.SaveFormat.JPEG }
  );
  const compressedResponse = await fetch(compressed.uri);
  const compressedBlob = await compressedResponse.blob();
  return { blob: compressedBlob, size: compressedBlob.size, uri: compressed.uri };
} 