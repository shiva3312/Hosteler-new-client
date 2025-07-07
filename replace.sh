#!/bin/bash

# TO RUN THIS SCRIPT:
# 1. Save this script as `replace.sh`.
# 2. Make it executable: `chmod +x replace.sh`.
# 3. Run it with the flag: `./replace.sh --run`.

# === FLAG CHECK ===
if [[ "$1" != "--run" ]]; then
  echo "❌ No execution flag passed."
  echo "ℹ️  To run this script, use: ./replace.sh --run"
  exit 1
fi


FOLDER="./src/components/ui/organization"

# 🔤 Words to replace inside file content
SEARCH_WORDS_IN_FILE=("user" "User")
REPLACE_WORDS_IN_FILE=("organization" "Organization")

# 📄 Words to replace in file/folder names
SEARCH_WORDS_IN_FILENAME=("user" )
REPLACE_WORDS_IN_FILENAME=("organization" )

echo "✅ Script started running..."

# --- 1. Rename files and directories ---
for i in "${!SEARCH_WORDS_IN_FILENAME[@]}"; do
  search="${SEARCH_WORDS_IN_FILENAME[$i]}"
  replace="${REPLACE_WORDS_IN_FILENAME[$i]}"

  find "$FOLDER" -depth -name "*$search*" | while read fname; do
    newname=$(echo "$fname" | sed "s/$search/$replace/g")
    if [ "$fname" != "$newname" ]; then
      echo "🔁 Renaming: $fname → $newname"
      mv "$fname" "$newname"
    fi
  done
done

# --- 2. Replace inside file contents ---
for i in "${!SEARCH_WORDS_IN_FILE[@]}"; do
  search="${SEARCH_WORDS_IN_FILE[$i]}"
  replace="${REPLACE_WORDS_IN_FILE[$i]}"

  grep -rl --exclude-dir=".git" --exclude="*.bin" "$search" "$FOLDER" | while read file; do
    echo "✏️  Replacing '$search' with '$replace' in: $file"
    sed -i "" "s/$search/$replace/g" "$file"  # For macOS; use sed -i "..." for Linux
  done
done

echo "✅ All replacements complete."


# # 3. Remove empty directories
# find "$FOLDER" -type d -empty -delete
# # 4. Remove empty files
# find "$FOLDER" -type f -empty -delete
# # 5. Remove files with specific extensions
# find "$FOLDER" -type f \( -name "*.log" -o -name "*.tmp" \) -delete
# # 6. Remove files with specific names
# find "$FOLDER" -type f \( -name "README.md" -o -name "LICENSE" \) -delete   
# # 7. Remove files with specific patterns
# find "$FOLDER" -type f -name "*.bak" -delete
# # 8. Remove files larger than a specific size (e.g., 100MB)
# find "$FOLDER" -type f -size +100M -delete
# # 9. Remove files older than a specific time (e.g., 30 days)
# find "$FOLDER" -type f -mtime +30 -delete
# # 10. Remove files with specific permissions (e.g., world-writable)
# find "$FOLDER" -type f -perm /o+w -delete
# # 11. Remove files with specific ownership (e.g., owned by a specific user)
# # find "$FOLDER" -type f -user specificuser -delete
# # 12. Remove files with specific group ownership (e.g., owned by a specific group)
# # find "$FOLDER" -type f -group specificgroup -delete
# # 13. Remove files with specific extensions in a specific directory
# # find "$FOLDER/specific-dir" -type f -name "*.tmp" -delete
# # 14. Remove files with specific names in a specific directory
# # find "$FOLDER/specific-dir" -type f -name "tempfile.txt"