import { useRef, useState } from 'react';
import { GenerateThumbnailProps } from '@/types';
import { Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';


const GenerateThumbnail = ({ description, image }: GenerateThumbnailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [image2, setImage] = useState(null);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    try {
      if (e.target.files) {
        const formData = new FormData();
        Object.values(e.target.files).forEach((file) => {
          formData.append("file", file);
        });
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setIsImageLoading(false);
        if (result.success) {
          setImage(result.name)
          toast({
            title: `Uploaded + ${result.name} successfully`,
          })
          alert("Upload ok : " + result.name);
        } else {
          toast({ title: 'Error uploading image', variant: 'destructive' })
        }
      }
    }
    catch (e) {
      console.error(e)
    }
  }
  return (
    <>
      <div className="flex flex-col items-start w-full">
        <div className="img_grid" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            name='image'
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
          ) : (
            <div className="text-sm flex-center font-medium text-primary">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-sm font-bold text-primary">
              Click to upload
            </h2>
            <p className="text-xs font-normal text-graylight">{description}</p>
          </div>
        </div>
        {image2 ? (
          <div className="relative flex-center w-full">
            <Image
              src={image2}
              width={400}
              height={400}
              className="rounded-xl mt-5"
              alt="thumbnail"
            />
          </div>
          
        ) :
          !image ? (
            <>
            </>
          ) : (
            <div className="relative flex-center w-full">
              <Image
                src={image}
                width={400}
                height={400}
                className="rounded-xl mt-5"
                alt="thumbnail"
              />
            </div>
          )
        }
      </div>
    </>
  )
}

export default GenerateThumbnail