import { useState } from "preact/hooks";
import {
  ListImages,
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
      await PullImage(imageName);
      success(`Pulled image: ${imageName}`);
    } catch (err) {
      console.log("pullImage error", err);
      error(`Failed to pull: ${imageName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getImages = async () => {
    const data = await ListImages();
    console.log(data);
  };

  return (
    <div className="flex gap-2 w-full justify-center">
      <div className="flex gap-2 w-1/2">
        <button onClick={() => getImages()}>refresh</button>
        <input
          id="imageName"
          className="input rounded-full focus:outline-none"
        ></input>
        <button className="btn btn-success rounded-full">
          {isLoading ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            <span onClick={() => pullImage()}>Pull</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImagePull;
