import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Share1Icon } from '@radix-ui/react-icons'
import { CircleCheckBig, Copy } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share'
import { FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

function ShareButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 3000) // Reset the icon back after 3 seconds
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Share1Icon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Copy the link and share your best gym with your friends!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleCopyLink}
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <CircleCheckBig className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex justify-around mt-4">
          <FacebookShareButton url={link}>
            <FaFacebook className="h-6 w-6 text-blue-600" />
          </FacebookShareButton>
          <TwitterShareButton url={link}>
            <FaTwitter className="h-6 w-6 text-blue-400" />
          </TwitterShareButton>
          <WhatsappShareButton url={link}>
            <FaWhatsapp className="h-6 w-6 text-green-500" />
          </WhatsappShareButton>
          <EmailShareButton url={link}>
            <FaEnvelope className="h-6 w-6 text-gray-600" />
          </EmailShareButton>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareButton
