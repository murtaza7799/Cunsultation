import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebase';

const ImageSkaches = async () => {
  const spaceRef = await ref(storage, '/images');
  const filesRef = await listAll(spaceRef);
  const files = await Promise.all(
    filesRef.items.map(async (file) => {
      const url = await getDownloadURL(file);
      return url;
    })
  );
  return files;
};

export default ImageSkaches;
