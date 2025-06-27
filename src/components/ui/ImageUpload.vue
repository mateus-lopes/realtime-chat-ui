<template>
  <div class="image-upload">
    <div class="upload-area" :class="{ 'upload-area--dragover': isDragOver }">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        class="file-input"
        :disabled="uploading"
      />

      <div v-if="!preview && !uploading" class="upload-placeholder">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path
              fill="currentColor"
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
        </div>
        <p class="upload-text">
          <span class="upload-primary">Clique para selecionar</span>
          <span class="upload-secondary">ou arraste uma imagem aqui</span>
        </p>
        <p class="upload-hint">PNG, JPG até 5MB</p>
      </div>

      <div v-if="preview && !uploading" class="preview-container">
        <img :src="preview" alt="Preview" class="preview-image" />
        <div class="preview-overlay">
          <button @click="removeImage" class="remove-btn" type="button">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
          <button @click="triggerFileSelect" class="change-btn" type="button">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="uploading" class="uploading-state">
        <div class="upload-spinner">
          <svg viewBox="0 0 24 24" width="32" height="32" class="spinner">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-dasharray="31.416"
              stroke-dashoffset="31.416"
            />
          </svg>
        </div>
        <p class="uploading-text">Processando imagem...</p>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  modelValue?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 5,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  upload: [file: File];
  remove: [];
}>();

const fileInput = ref<HTMLInputElement>();
const preview = ref<string>(props.modelValue || "");
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref<string>("");
const isDragOver = ref(false);

const maxSizeBytes = computed(() => props.maxSize * 1024 * 1024);

const validateFile = (file: File): boolean => {
  error.value = "";

  if (!file.type.startsWith("image/")) {
    error.value = "Por favor, selecione apenas arquivos de imagem";
    return false;
  }

  if (file.size > maxSizeBytes.value) {
    error.value = `Arquivo muito grande. Máximo ${props.maxSize}MB`;
    return false;
  }

  return true;
};

const processFile = async (file: File) => {
  if (!validateFile(file)) return;

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Convert to base64
    const base64 = await fileToBase64(file);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      uploadProgress.value += 10;
      if (uploadProgress.value >= 90) {
        clearInterval(progressInterval);
      }
    }, 100);

    // Set preview
    preview.value = base64;
    uploadProgress.value = 100;

    emit("update:modelValue", base64);
    emit("upload", file);

    clearInterval(progressInterval);
  } catch (err) {
    error.value = "Erro ao processar imagem";
    console.error("Image processing error:", err);
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const removeImage = () => {
  preview.value = "";
  error.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit("update:modelValue", "");
  emit("remove");
};
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-area {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
}

.upload-area:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.upload-area--dragover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-input:disabled {
  cursor: not-allowed;
}

.upload-placeholder {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.upload-text {
  margin-bottom: 0.5rem;
}

.upload-primary {
  color: #3b82f6;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.upload-secondary {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.upload-hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin: 0;
}

.preview-container {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 120px;
  max-height: 120px;
  display: block;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.remove-btn,
.change-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: #ef4444;
}

.change-btn:hover {
  background: rgba(59, 130, 246, 0.8);
  border-color: #3b82f6;
}

.uploading-state {
  pointer-events: none;
}

.upload-spinner {
  color: #3b82f6;
  margin-bottom: 1rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

.uploading-text {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .upload-area {
    padding: 1.5rem;
  }

  .preview-image {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
  }

  .upload-icon svg {
    width: 40px;
    height: 40px;
  }
}
</style>
