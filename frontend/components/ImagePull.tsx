import { useEffect, useState } from "preact/hooks";
import {
  ListImagesV2,
  PullImage,
} from "../bindings/github.com/shreyas-shriyan/dibba/imageservice";
import { useToast } from "./Toast";

const ImagePull = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { success, error } = useToast();

  const pullImage = async () => {
    const imageName = (document.getElementById("imageName") as HTMLInputElement)
      .value;
    setIsLoading(true);
    try {
      await PullImage(imageName.toLowerCase());
      success(`Pulled image: ${imageName}`);
      getImages();
    } catch (err) {
      console.log("pullImage error", err);
      error(`Failed to pull: ${imageName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getImages = async () => {
    const data = await ListImagesV2();
    setImages(data);
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div>
      <div className="flex gap-2 w-full justify-center">
        <div className="flex gap-2 w-1/2">
          <button onClick={() => getImages()}>refresh</button>
          <input
            id="imageName"
            className="input rounded-full focus:outline-none"
            autocapitalize="none"
            autocorrect="off"
            spellcheck={false}
          ></input>
          <button className="btn btn-success rounded-full cursor-pointer shadow-none">
            {isLoading ? (
              <span className="loading loading-dots loading-xs"></span>
            ) : (
              <span onClick={() => pullImage()}>Pull</span>
            )}
          </button>
        </div>
        {/* create a table with the images */}
      </div>
      <table className="table table-zebra table-pin-rows table-sm">
        <thead>
          <tr>
            <th>Repository</th>
            <th>Tag</th>
            <th>Image Id</th>
            <th>Created</th>
            <th>Architecture</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image.imageId}>
              <td>{image.name}</td>
              <td>{image.tag}</td>
              <td>{image.imageId}</td>
              <td>{image.created}</td>
              <td>{image.architecture}</td>
              <td>{image.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImagePull;
