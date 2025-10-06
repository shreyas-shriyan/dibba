package main

import (
	"fmt"
	"os/exec"
)

type ContainerService struct{}

func (c *ContainerService) CheckContainerServiceRunning() bool {
	cmd := exec.Command("container", "system", "status")
	_, err := cmd.Output()

	return err == nil
}

func (c *ContainerService) StartContainerService() {
	cmd := exec.Command("container", "system", "start")
	_, err := cmd.Output()
	if err != nil {
		fmt.Println("Failed to start container")
	}
}

func (c *ContainerService) StopContainerService() {
	cmd := exec.Command("container", "system", "stop")
	_, err := cmd.Output()
	if err != nil {
		fmt.Println("Failed to stop container")
	}
}
