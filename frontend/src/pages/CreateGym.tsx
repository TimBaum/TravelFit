import CreateGymForm from '@/components/CreateGymForm'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

function CreateUserAccount() {
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
              <BreadcrumbLink href="/add-gym">Add Gym</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-5xl font-bold mb-2">Add Gym</h1>
      <div>
        <CreateGymForm />
      </div>
    </>
  )
}

export default CreateUserAccount
