# Create public/images directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "..\..\jim-react-new\public\images"

# Copy all images from the original project
Copy-Item -Path "..\..\images\*" -Destination "..\..\jim-react-new\public\images\" -Recurse -Force