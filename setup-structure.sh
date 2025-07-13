#!/bin/bash

# Root directory
mkdir -p src

# Subdirectories
mkdir -p src/api
mkdir -p src/components/Button
mkdir -p src/features/notes
mkdir -p src/screens
mkdir -p src/state/slices
mkdir -p src/ai
mkdir -p src/utils
mkdir -p src/navigation
mkdir -p src/constants

# Files
touch src/App.tsx

# Component files
touch src/components/Button/Button.tsx
touch src/components/Button/styles.ts

# Feature module
touch src/features/notes/NoteScreen.tsx
touch src/features/notes/NoteItem.tsx
touch src/features/notes/noteSlice.ts

# Screens
touch src/screens/HomeScreen.tsx
touch src/screens/DetailScreen.tsx

# State management
touch src/state/store.ts
touch src/state/slices/userSlice.ts

# AI integration
touch src/ai/useChatGPT.ts
touch src/ai/promptUtils.ts

# Utils
touch src/utils/dateUtils.ts
touch src/utils/formatters.ts

# Navigation
touch src/navigation/AppNavigator.tsx
touch src/navigation/navigationTypes.ts

# Constants
touch src/constants/colors.ts
touch src/constants/config.ts

echo "✅ Folder structure created."