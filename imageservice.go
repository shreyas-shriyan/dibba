package main

import (
	"os/exec"
)

type ImageService struct{}

func (c *ImageService) PullImage(imageName string) (string, error) {
	cmd := exec.Command("container", "image", "pull", imageName)
	data, err := cmd.CombinedOutput()
	return string(data), err
}

func (c *ImageService) ListImages() (string, error) {
	cmd := exec.Command("container", "image", "ls")
	data, err := cmd.CombinedOutput()
	return string(data), err
}
