import { CloseIcon } from '@chakra-ui/icons';
import { Button, Box } from '@chakra-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import EmojiPicker from 'emoji-picker-react';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import React, { useState } from 'react'
import { MdOutlineEmojiEmotions } from 'react-icons/md';

const EmojiPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [emojiOpen, setEmojiOpen] = useState(false);

    function handleEmojiClick(emoji) {
        editor.update(() => {
            const root = $getRoot();
            const p = $createParagraphNode();
            p.append(emoji);
            root.append(p);
        });
    }
    return (
        <Box position="relative">
            {emojiOpen && (
                <Box>
                    <EmojiPicker
                        height={300}
                        width="100%"
                        style={{
                            position: "absolute",
                            bottom: "47px",
                            minWidth: "350px"
                        }}
                        emojiStyle="google"
                        searchDisabled
                        onEmojiClick={(emoji) => {
                            handleEmojiClick(emoji)
                        }}
                        previewConfig={{ showPreview: false }}
                    />
                </Box>
            )}
            <Box>
                <Button
                    size="md"
                    variant="ghost"
                    bg="transparent !important"
                    width="60px"
                    onClick={() => setEmojiOpen(!emojiOpen)}
                >
                    {emojiOpen ? (
                        <CloseIcon color="#61677c" />
                    ) : (
                        <MdOutlineEmojiEmotions fontSize="30px" color="#61677c" />
                    )}
                </Button>
            </Box>
        </Box>
    )
}

export default EmojiPlugin