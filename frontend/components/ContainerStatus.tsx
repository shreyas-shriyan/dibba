import {
  CheckContainerServiceRunning,
  StartContainerService,
} from "../bindings/github.com/shreyas-shriyan/dibba/containerservice";
import { effect, signal } from "@preact/signals";
import { Events } from "@wailsio/runtime";

const isContainerRunning = signal(false);

Events.On("containerStatus", (value) => {
  isContainerRunning.value = value.data[0];
});

const ContainerStatus = () => {
  // check container service status
  effect(() => {
    (async () => {
      const isRunning = await CheckContainerServiceRunning();
      isContainerRunning.value = isRunning;
    })();
  });

  const handleRestart = async () => {
    try {
      await StartContainerService();
      isContainerRunning.value = true;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class="flex items-center gap-2">
      <div
        class={`w-3 h-3 rounded-full ${
          isContainerRunning.value ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span class="text-sm text-gray-600">
        {isContainerRunning.value ? "Service: Running" : "Service: Stopped"}
      </span>
      {!isContainerRunning.value && (
        <svg
          className="w-5 h-5 text-success hover:text-success cursor-pointer transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          onClick={handleRestart}
          title="Restart Service"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </div>
  );
};

export default ContainerStatus;
