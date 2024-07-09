import CreateGymForm from '@/components/CreateGymForm'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useParams } from 'react-router-dom'

function CreateUserAccount() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  return (
    <>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-gyms">My Gyms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={isEdit ? `/edit-gym/${id}` : '/create-gym'}>
                {isEdit ? 'Edit Gym' : 'Create Gym'}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-5xl font-bold mb-2">
        {isEdit ? 'Edit Gym' : 'Add Gym'}
      </h1>
      <div>
        <CreateGymForm mode={isEdit ? 'edit' : 'create'} />
      </div>
    </>
  )
}

export default CreateUserAccount
