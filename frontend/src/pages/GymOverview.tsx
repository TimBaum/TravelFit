
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import '@/index.css'
import '@/styles/gym-overview.css'
import { Share1Icon, BookmarkIcon } from "@radix-ui/react-icons"
  

function GymOverview(){
    return(
        <div>
            <div className="breadcrumps">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Find gyms</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/components">City placeholder</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Gym name placeholder</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="header-container">
                <h1 className="text-5xl font-bold pb-2">Placeholder: gymname</h1>
                <div className="header-icons">
                    <Share1Icon className="icon" />
                    Share
                    <BookmarkIcon className="icon"/>
                    Mark as favourite
                </div>
            </div>
        </div>
    )
}

export default GymOverview