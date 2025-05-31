import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#e2e8f0';
    switch (variant) {
      case 'primary':
        return '#4CAF50';
      case 'secondary':
        return '#f8fafc';
      case 'outline':
        return 'transparent';
      default:
        return '#4CAF50';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94a3b8';
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return '#235347';
      case 'outline':
        return '#235347';
      default:
        return '#ffffff';
    }
  };

  const getBorderColor = () => {
    if (disabled) return '#e2e8f0';
    switch (variant) {
      case 'outline':
        return '#235347';
      case 'secondary':
        return '#e2e8f0';
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {LeftIcon && (
            <LeftIcon
              size={getIconSize()}
              color={getTextColor()}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
            ]}
          >
            {title}
          </Text>
          {RightIcon && (
            <RightIcon
              size={getIconSize()}
              color={getTextColor()}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
}); 