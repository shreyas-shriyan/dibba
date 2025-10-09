import ContainerStatus from "./components/ContainerStatus";
import ImagePull from "./components/ImagePull";

export function App() {
  return (
    <div class="container text-center mx-auto max-w-4xl p-4 pt-2">
      <h1 class="text-2xl font-bold text-success">Dibba</h1>
      <ContainerStatus></ContainerStatus>
      <ImagePull></ImagePull>
    </div>
  );
}
