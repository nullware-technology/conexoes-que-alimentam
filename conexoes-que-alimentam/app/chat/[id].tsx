import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { mockChats, ChatMessage, Chat as ChatType } from '@/constants/mockChats';
import { ChatMessage as ChatMessageComponent } from '../../components/ChatMessage';
import { MOCK_INSTITUTIONS } from '@/utils/mockData';
import { ArrowLeft, Send, Building2, Heart, Users, ChevronLeft, UserCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper to get a specific chat by ID
const getChatMessages = (chatIdKey: string): ChatMessage[] => {
  const chat = mockChats.find(c => c.id === chatIdKey);
  return chat ? chat.messages : [];
};

export default function ChatMessageScreen() {
  const router = useRouter();
  // Ensure types for params are correct
  const params = useLocalSearchParams<{ id?: string; institutionName?: string }>();
  const institutionId = params.id;
  const institutionNameFromParams = params.institutionName;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  // chatPartner will now primarily store name from params, and avatar if found
  const [chatPartnerInfo, setChatPartnerInfo] = useState<{ name: string; avatar?: string } | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const currentUserId = 'currentUser';

  useEffect(() => {
    if (institutionId) {
      // Attempt to derive a chatId for mockChats (e.g., institution "1" -> mockChat "chat1")
      const mockChatId = `chat${institutionId}`;
      const chatMessages = getChatMessages(mockChatId);
      setMessages(chatMessages);

      // Set chat partner info using institutionName from params
      // and try to find an avatar from MOCK_INSTITUTIONS as a fallback
      let avatar;
      const institutionDetails = MOCK_INSTITUTIONS.find(inst => inst.id === institutionId);
      if (institutionDetails) {
        avatar = institutionDetails.logoUrl; // Or imageUrl if preferred
      }
      
      // If mockChat also has an avatar and we prefer it, we could use it:
      // const mockChatDetails = mockChats.find(c => c.id === mockChatId);
      // if (mockChatDetails?.avatar) avatar = mockChatDetails.avatar;


      setChatPartnerInfo({
        name: institutionNameFromParams || "Chat", // Use passed name
        avatar: avatar // Use avatar from MOCK_INSTITUTIONS if found
      });

      if (!institutionNameFromParams) {
        console.warn('Institution name not provided to chat screen for ID:', institutionId);
      }
      // If chatMessages is empty, it means no specific mock chat was found for this institutionId
      // This is fine, it will just be an empty chat.

    } else {
      // console.warn('Institution ID is missing in chat screen');
      // router.back(); // Optionally navigate back
    }
  }, [institutionId, institutionNameFromParams, router]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim().length === 0) {
      return;
    }
    const newMessage: ChatMessage = {
      id: String(Date.now()), // Mock ID
      message: inputText.trim(),
      isUser: true, // Messages sent from this screen are from the current user
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    return (
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text style={item.isUser ? styles.currentUserMessageText : styles.otherUserMessageText}>
          {item.message}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (!institutionId) { // chatId (institutionId) is not available
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
         <StatusBar barStyle="dark-content" />
        <Stack.Screen options={{ headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={28} color="#235347" />
            </TouchableOpacity>
          ), headerTitle: "Chat Inválido" }} />
        <Text>ID da instituição não encontrado.</Text>
      </SafeAreaView>
    );
  }

  if (!chatPartnerInfo && institutionId) { // Still loading details or chat not found
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
        <StatusBar barStyle="dark-content" />
         <Stack.Screen options={{ headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={28} color="#235347" />
            </TouchableOpacity>
          ), headerTitle: "Carregando..." }} />
        <Text>Carregando informações do chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
       <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          headerTitle: () => (
            <TouchableOpacity 
              onPress={() => {
                if (institutionId) {
                  router.push(`/institution/${institutionId}`);
                }
              }}
              style={styles.headerTouchable}
            >
              <View style={styles.headerTitleContainer}>
                {chatPartnerInfo?.avatar ? (
                  <Image source={{ uri: chatPartnerInfo.avatar }} style={styles.headerAvatar} />
                ) : (
                  // Use Building2 icon if no avatar, representing an institution
                  <Building2 size={30} color="#4A5568" style={styles.headerAvatarPlaceholder} />
                )}
                <Text style={styles.headerName} numberOfLines={1} ellipsizeMode="tail">
                  {chatPartnerInfo?.name || 'Chat'}
                </Text>
              </View>
            </TouchableOpacity>
          ),
           headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={28} color="#235347" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: '#FFFFFF' }, // White header background
          headerShadowVisible: true, // Add a subtle shadow to the header
          headerTitleAlign: 'left',
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjusted for typical header height
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          // The following are good for UX, ensuring view stays at bottom
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#8E8E93" // Softer placeholder color
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={inputText.trim().length === 0}>
            <Send size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9', // A slightly off-white for chat background, less harsh than pure white
  },
  safeAreaLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
  },
  // Header Styles
  headerTouchable: {
    flex: 1, // Allow touchable to expand
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.05)', // Optional: for touch feedback
    height: '100%', // Ensure it takes full header height for touch
    marginLeft: Platform.OS === 'android' ? -16 : 0, // Counteract default Android spacing
    marginRight: Platform.OS === 'android' ? 16: 0, // Provide some space for Android if title is long
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft removed from here, handled by headerTouchable or default Stack behavior
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerAvatarPlaceholder: {
    marginRight: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E', // Darker text for header
  },
  backButton: {
    // iOS already has enough space, Android might need more if not using platform default
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 12,
    paddingVertical:5,
  },
  // Message List Styles
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 15, // More padding around messages
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18, // Slightly more rounded bubbles
    marginBottom: 10,
    maxWidth: '78%',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  currentUserBubble: {
    backgroundColor: '#235347', // Main theme color for sent messages
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6, // Differentiated corner
  },
  otherUserBubble: {
    backgroundColor: '#FFFFFF', // White for received messages
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5EA', // Subtle border for received messages
    borderBottomLeftRadius: 6, // Differentiated corner
  },
  currentUserMessageText: {
    fontSize: 15.5,
    color: '#FFFFFF',
    lineHeight: 21, // Better readability
  },
  otherUserMessageText: {
    fontSize: 15.5,
    color: '#1C1C1E', // Dark text for received messages
    lineHeight: 21,
  },
  messageTime: {
    fontSize: 11,
    color: '#FFFFFF', // White time for sent messages
    opacity: 0.8,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  // Input Area Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to bottom for multiline input
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Extra padding for home indicator on iOS
    borderTopWidth: 1,
    borderTopColor: '#DCDCDC',
    backgroundColor: '#F0F0F0', // Slightly different background for input area
  },
  input: {
    flex: 1,
    minHeight: 42, // Slightly taller input
    maxHeight: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 21, // Corresponds to minHeight/2
    paddingHorizontal: 16,
    paddingVertical: 10, // Vertical padding for text input
    fontSize: 16,
    lineHeight: 20, // For multiline
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C7C7CD',
  },
  sendButton: {
    backgroundColor: '#235347',
    borderRadius: 21, // Circular button
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 2, // Align with text input on Android
  },
}); 