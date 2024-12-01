import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "./Avatar";
import { CircleIcon} from "lucide-react";
import {EditorComment} from "./EditorComment";
import {Comment} from "../types/comment";
import {User} from "../types/user";
import {EditorCommentStyle2} from "./EditorCommentStyle2";
import {makeid} from "../lib/utils";
import {MDXProvider} from "@mdx-js/react";
import PreviewComment from "./PreviewComment";
import {formatDistance} from 'date-fns';
import {DropdownMenu} from "./DropdownMenu";
import {EditingEditorComment} from "./EditingEditorComment";

interface CommentProps {
  className?: string;
  isMdxEditor?: boolean;
  formatDate?: string;
  value: Comment[];
  currentUser: User,
  onChange?: (value: Comment[]) => void,
  theme: 'light' | 'dark' | 'system',
  allowUpVote?: boolean;
  onVoteChange?: (checked: boolean) => void
}

interface CommentCardProps {
  comment: Comment,
  onReply: (val: string) => void,
  currentUser: User,
  allowUpVote?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (change: any) => void;
  onDelete: () => void;
  onVoteChange: (change: boolean) => void;
  theme: 'light' | 'dark' | 'system',
}

export const CommentCard = ({
                              comment,
                              onReply = () => {
                              },
                              currentUser,

                              onChange,
    
                              theme,
                              onDelete,
                            }: CommentCardProps) => {
  const [replying, setReplying] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <div className={'flex flex-col gap-1'} id={`comment-${comment.id}`}>
      <div className={'flex gap-4'}>
        <Avatar className={'w-[32px] h-[32px]'}>
          <AvatarImage src={comment.user?.avatarUrl}/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={`flex flex-col w-full`}>
          <div className={'min-h-[30px] rounded-lg s-comment-card border'}>
            <div
              className={'h-[37px] w-full user rounded-t-lg flex items-center justify-between border-b'}>
              <div className={'flex items-center px-3'}>
                <span className={'font-semibold'}>{comment.user?.fullName}</span>
              </div>
              <DropdownMenu
                comment={comment}
                currentUser={currentUser}
                openEditor={() => {
                  setEditing(true)
                }}
                deleteComment={onDelete}
              />
            </div>
            <div className={'p-3'}>
              {editing ?
                <EditingEditorComment
                  currentUser={currentUser}
                  theme={theme}
                  value={comment.text}
                  onChange={(val) => {
                    onChange({
                      text: val
                    })
                    setEditing(false)
                  }}/>
                : <PreviewComment source={comment.text}/>}
            </div>
          </div>
          <div className={'flex gap-2 items-center text-sm font-semibold light:text-gray-600 ml-1'}>
            <span className={'cursor-pointer text-primary'} onClick={() => setReplying(true)}>Reply</span>
            <CircleIcon size={3}/>
            <span
              className={'text-opacity-80'}>{formatDistance(Date.now(), comment.createdAt, {addSuffix: true})}</span>
          </div>
        </div>
      </div>
      {replying ?
        <div className={'ml-[48px]'}>
          <EditorCommentStyle2 onChange={onReply} currentUser={currentUser}/>
        </div>
        : null}
      {comment.replies && comment.replies.length > 0 ?
        <div className={'ml-[48px] flex flex-col gap-2'}>
          {comment.replies.map(rep => (
            <div className={'w-full flex gap-2'} key={rep.id}>
              <Avatar className={'w-[28px] h-[28px] text-sm'}>
                <AvatarImage src={comment.user?.avatarUrl}/>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className={'flex flex-col'}>
                <div className={'flex'}>{rep.text}</div>
                <div className={'inline-flex gap-1 text-sm font-semibold light:text-gray-600'}>
                  <div className={'text-primary'}>{rep.user?.fullName}</div>
                  <div
                    className={'text-opacity-80'}>{formatDistance(Date.now(), rep.createdAt, {addSuffix: true})}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        : null}
    </div>
  )
}

export const CommentSection = ({
                                 className = '',
                                 value,
                                 onChange = () => {
                                 },
                                 theme = 'light',
                                 currentUser,
                                 allowUpVote = false,
                                 onVoteChange = () => {
                                 }
                               }: CommentProps) => {
  return (
    <MDXProvider
      components={{
        wrapper(props) {
          return <div style={{backgroundColor: 'lightblue'}} {...props} />;
        },
      }}
    >
      <div className={`max-w-screen-md flex flex-col gap-2 w-full ${className}`}>
        <EditorComment
          currentUser={currentUser}
          theme={theme}
          onChange={(val) => {
            onChange([{
              id: makeid(8),
              user: currentUser,
              createdAt: new Date(),
              replies: [],
              text: val,
            }, ...(value ?? [])])
          }}/>
        {value.map(e => (
          <CommentCard
            currentUser={currentUser}
            onReply={(rep) => {
              if (value) {
                onChange(value.map(f => f.id === e.id ? {
                  ...f,
                  replies: [{
                    id: makeid(8),
                    parentId: e.id,
                    user: currentUser,
                    createdAt: new Date(),
                    replies: [],
                    text: rep,
                  }, ...(f.replies ?? [])]
                } : f))
              }
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(change: any) => {
              if (value)
                onChange(value.map(f => f.id === e.id ? {
                  ...f,
                  ...change,
                } : f))
            }}
            onDelete={() => {
              onChange(value.filter(f => f.id !== e.id))
            }}
            comment={e}
            key={e.id}
            allowUpVote={allowUpVote}
            theme={theme}
            onVoteChange={onVoteChange}
          />
        ))}
      </div>
    </MDXProvider>
  )
}