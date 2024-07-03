import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'

function Dropzone() {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader()

    file.readAsDataURL(acceptedFiles[0])
  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
    })

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))

  /**
   * handleOnSubmit
   */

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    if (typeof acceptedFiles[0] === 'undefined') return

    const formData = new FormData()

    formData.append('file', acceptedFiles[0])
    formData.append('upload_preset', 'test_preset')
    formData.append('api_key', import.meta.env.CLOUDINARY_KEY)

    const results = await fetch(
      'https://api.cloudinary.com/v1_1/travelfit/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((r) => r.json())

    console.log('results', results)
  }

  return (
    <div>
      <form
        className="max-w-md border border-gray-200 rounded p-6 mx-auto"
        onSubmit={handleOnSubmit}
      >
        <div
          {...getRootProps({
            className:
              'dropzone w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-100 cursor-pointer transition duration-300 ease-in-out hover:bg-emerald-200',
          })}
        >
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
        <Button
          type="submit"
          className="mt-4 bg-emerald-500 text-white py-2 px-4 rounded"
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default Dropzone
