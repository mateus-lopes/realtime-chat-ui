<template>
  <div class="relative" ref="dropdownRef">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @focus="isOpen = true"
        @input="handleSearch"
        type="text"
        placeholder="Buscar mensagens..."
        class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 pr-10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
      
      <!-- Search Icon -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen && (searchResults.length > 0 || searchQuery)"
        class="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-y-auto"
      >
        <!-- Search Options -->
        <div v-if="!searchQuery" class="py-2">
          <div class="px-4 py-2 text-gray-400 text-sm font-medium">Opções de busca</div>
          
          <button
            @click="handleSearchOption('photos')"
            class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Fotos</div>
              <div class="text-gray-400 text-sm">Buscar por imagens</div>
            </div>
          </button>

          <button
            @click="handleSearchOption('videos')"
            class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Vídeos</div>
              <div class="text-gray-400 text-sm">Buscar por vídeos</div>
            </div>
          </button>

          <button
            @click="handleSearchOption('documents')"
            class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Documentos</div>
              <div class="text-gray-400 text-sm">Buscar por arquivos</div>
            </div>
          </button>

          <button
            @click="handleSearchOption('links')"
            class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Links</div>
              <div class="text-gray-400 text-sm">Buscar por links</div>
            </div>
          </button>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchResults.length > 0" class="py-2">
          <div class="px-4 py-2 text-gray-400 text-sm font-medium">
            {{ searchResults.length }} resultado(s) encontrado(s)
          </div>
          
          <div
            v-for="result in searchResults"
            :key="result.id"
            @click="selectResult(result)"
            class="px-4 py-3 hover:bg-gray-700 transition-colors duration-150 cursor-pointer border-l-2 border-transparent hover:border-blue-500"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-gray-200 text-sm" v-html="highlightText(result.content, searchQuery)"></div>
                <div class="text-gray-400 text-xs mt-1">{{ result.date }} • {{ result.sender }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery" class="py-8 text-center">
          <div class="text-gray-400 text-sm">Nenhuma mensagem encontrada</div>
          <div class="text-gray-500 text-xs mt-1">Tente usar palavras-chave diferentes</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface SearchResult {
  id: string
  content: string
  sender: string
  date: string
  type: 'text' | 'photo' | 'video' | 'document' | 'link'
}

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement>()

// Mock search results
const searchResults = ref<SearchResult[]>([])

const emit = defineEmits<{
  search: [query: string, type?: string]
  selectResult: [result: SearchResult]
  searchOption: [type: string]
}>()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Mock search results
    searchResults.value = [
      {
        id: '1',
        content: `Esta é uma mensagem que contém "${searchQuery.value}" no texto`,
        sender: 'João Silva',
        date: '14:30',
        type: 'text'
      },
      {
        id: '2',
        content: `Outra mensagem com "${searchQuery.value}" aqui também`,
        sender: 'Maria Fernanda',
        date: '13:45',
        type: 'text'
      }
    ]
    emit('search', searchQuery.value)
  } else {
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  isOpen.value = false
}

const selectResult = (result: SearchResult) => {
  emit('selectResult', result)
  isOpen.value = false
}

const handleSearchOption = (type: string) => {
  emit('searchOption', type)
  isOpen.value = false
}

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-500 text-black px-1 rounded">$1</mark>')
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
