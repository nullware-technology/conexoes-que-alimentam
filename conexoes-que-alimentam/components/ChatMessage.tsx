import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const formattedTime = format(parseISO(timestamp), 'HH:mm', { locale: ptBR });

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.otherText
        ]}>
          {message}
        </Text>
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.otherTimestamp
        ]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#4ade80',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  otherText: {
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimestamp: {
    color: '#64748b',
  },
}); 