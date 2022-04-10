import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  useToast
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import ConversationArea from '../../classes/ConversationArea';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useMaybeVideo from '../../hooks/useMaybeVideo';


type NewConversationModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  newConversation: ConversationArea;
};

export default function NewConversationModal({ isOpen, closeModal, newConversation }: NewConversationModalProps): JSX.Element {
  const [topic, setTopic] = useState<string>('');
  const { apiClient, sessionToken, currentTownID } = useCoveyAppState();

  const toast = useToast()
  const video = useMaybeVideo()

  const [isRecreationArea, setIsRecreationArea] = useState(false);
  const toggleIsRecreationArea = () => {
    console.log(isRecreationArea ? 'Change to Conversation Area' : 'Change to Recreation Area');
    setIsRecreationArea(!isRecreationArea);
  }

  useEffect(() => setIsRecreationArea(false), []);

  const createConversation = useCallback(async () => {
    const areaType = isRecreationArea ? 'Recreation' : 'Conversation';
    if (topic) {
      const conversationToCreate = newConversation;
      conversationToCreate.topic = topic;
      try {
        if (isRecreationArea) {
          console.log('create recreation');
          await apiClient.createRecreation({
            sessionToken,
            coveyTownID: currentTownID,
            conversationArea: conversationToCreate.toServerConversationArea(),
          });
        }
        else {
          await apiClient.createConversation({
            sessionToken,
            coveyTownID: currentTownID,
            conversationArea: conversationToCreate.toServerConversationArea(),
          });
        }
        toast({
          title: `${areaType} Created!`,
          status: 'success',
        });
        video?.unPauseGame();
        closeModal();
      } catch (err) {
        toast({
          title: `Unable to create ${areaType}`,
          description: err.toString(),
          status: 'error',
        });
      }
    }
  }, [isRecreationArea, topic, apiClient, newConversation, closeModal, currentTownID, sessionToken, toast, video]);


  return (
    <Modal isOpen={isOpen} onClose={() => { closeModal(); video?.unPauseGame() }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a conversation in {newConversation.label} </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createConversation();
          }}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='topic'>Topic of Conversation</FormLabel>
              <Input
                id='topic'
                placeholder='Share the topic of your conversation'
                name='topic'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='toggle-rec-area' mb='0'>
                  Make Recreation Area?
                </FormLabel>
                <Switch id='toggle-rec-area' onChange={toggleIsRecreationArea} />
              </FormControl>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createConversation}>
              Create
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}