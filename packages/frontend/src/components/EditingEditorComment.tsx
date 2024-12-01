import {useState} from "react";
import {
  MDXEditor,
} from "@mdxeditor/editor";
import {Button} from "./Button";
import {User} from "../types/user";

interface EditorCommentProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string,
  onUpload?: (image: File) => Promise<string>;
  theme: 'light' | 'dark' | 'system',
  currentUser: User;
}

export const EditingEditorComment = ({
                                       value = '', onChange = () => {
  },
                                       placeholder = 'Add your comment here...',

                                       theme,
                         
                                     }: EditorCommentProps) => {
  const [tempValue, setTempValue] = useState(value)

  return (
    <div className={`flex flex-col gap-2 w-full editor-content-container`}>
      <div className={`flex gap-4 w-full`}>
        <div className={'w-full flex-1'}>
          <MDXEditor
            markdown={tempValue}
            onChange={setTempValue}
            placeholder={placeholder}
            className={`border rounded-lg prose-sm md:prose max-w-full editor-content ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
            contentEditableClassName={`overflow-y-auto py-2 whitespace-normal text-start`}

          />
        </div>
      </div>
      <div className={'flex justify-end items-center gap-2'}>
        <Button onClick={() => {
          onChange(value)
        }} variant={'destructive'} className={'h-8'}>Cancel</Button>
        <Button disabled={!tempValue} onClick={() => {
          onChange(tempValue)
          setTempValue('')
        }} className={'h-8'}>Update Comment</Button>
      </div>
    </div>
  )
}