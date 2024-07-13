import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
}

// Accept callback function that will be triggered when files are dropped/selected
function Dropzone({ onFilesSelected }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected],
  )

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop })

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))

  return (
    <div>
      <div
        {...getRootProps({
          className:
            'dropzone w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-100 cursor-pointer transition duration-300 ease-in-out hover:bg-emerald-200',
        })}
      >
        {/* spread input props from useDropzone hook to handle file selection */}
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <aside>
        <h4 className="mt-4">Files for upload: </h4>
        <ul>{files}</ul>
      </aside>
    </div>
  )
}

export default Dropzone
