import ContainerStatus from "./components/ContainerStatus";
import ImagePull from "./components/ImagePull";

export function App() {
  return (
    <div class="text-center mx-auto max-w-4xl p-4 pt-0">
      <div class="grid grid-cols-3 justify-between items-center">
        <div class="flex justify-start items-center h-14 "></div>
        <div class="flex justify-center items-center h-14 ">
          <h1 class="text-2xl font-bold text-success">Dibba</h1>
        </div>
        <div class="flex justify-end items-center h-14 ">
          <ContainerStatus></ContainerStatus>
        </div>
      </div>
      <div>
        <ImagePull></ImagePull>
      </div>
    </div>
  );
}
