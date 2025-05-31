import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { mockChats, Chat } from '../../constants/mockChats';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Building2, Heart, Users, HandHeart, PawPrint, Landmark } from 'lucide-react-native';

export default function ChatsScreen() {
  const router = useRouter();

  const getIcon = (type: string) => {
    const iconColor = "#4ade80"; // Existing color
    const iconSize = 20; // Existing size

    switch (type) {
      case 'ONG':
        return <Building2 size={iconSize} color={iconColor} />;
      case 'Campanha':
        return <Heart size={iconSize} color={iconColor} />;
      case 'Instituição Beneficente':
        return <HandHeart size={iconSize} color={iconColor} />;
      case 'Iniciativa Comunitária':
        return <Users size={iconSize} color={iconColor} />; // Keeping Users for this
      case 'Projeto Animal':
        return <PawPrint size={iconSize} color={iconColor} />;
      case 'Instituição': // Generic institution
        return <Landmark size={iconSize} color={iconColor} />;
      default:
        return <Users size={iconSize} color={iconColor} />; // Fallback
    }
  };

  const renderChatItem = ({ item, index }: { item: Chat; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <Pressable
        style={({ pressed }) => [
          styles.chatItem,
          pressed && styles.chatItemPressed
        ]}
        onPress={() => router.push({
          pathname: '/chat/[id]',
          params: { 
            id: item.id,
            institutionName: item.name,
          }
        })}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.iconContainer}>
            {getIcon(item.type)}
          </View>
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.lastMessageTime}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text
              style={styles.lastMessage}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversas</Text>
        <Text style={styles.subtitle}>
          Conecte-se com ONGs e campanhas
        </Text>
      </View>
      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    backgroundColor: '#235347',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  list: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatItemPressed: {
    backgroundColor: '#f8fafc',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3d34',
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#1a3d34',
    fontSize: 12,
    fontWeight: '600',
  },
}); 