import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'pending' | 'scheduled' | 'completed';
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'scheduled':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${getStatusColor()}15`,
          paddingVertical: size === 'small' ? 4 : 6,
          paddingHorizontal: size === 'small' ? 8 : 12,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getStatusColor(),
            fontSize: size === 'small' ? 12 : 14,
          },
        ]}
      >
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
}); 