import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '@/types'; // Assuming your types are in @/types
import uuid from 'react-native-uuid'; // For generating unique IDs

interface FoodContextType {
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id' | 'addedDate'>) => Promise<void>;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => Promise<void>;
  removeFoodItem: (id: string) => Promise<void>;
  getFoodItemById: (id: string) => FoodItem | undefined;
  loading: boolean;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

const FOOD_STORAGE_KEY = 'userFoodItems';

export function FoodProvider({ children }: { children: ReactNode }) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        setLoading(true);
        const storedItems = await AsyncStorage.getItem(FOOD_STORAGE_KEY);
        if (storedItems) {
          setFoodItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error('Failed to load food items from storage', error);
      } finally {
        setLoading(false);
      }
    };
    loadFoodItems();
  }, []);

  const saveFoodItems = async (items: FoodItem[]) => {
    try {
      await AsyncStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save food items to storage', error);
    }
  };

  const addFoodItem = async (itemData: Omit<FoodItem, 'id' | 'addedDate'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: uuid.v4() as string,
      addedDate: new Date().toISOString(),
    };
    const updatedItems = [...foodItems, newItem];
    setFoodItems(updatedItems);
    await saveFoodItems(updatedItems);
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    const updatedItems = foodItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setFoodItems(updatedItems);
    await saveFoodItems(updatedItems);
  };

  const removeFoodItem = async (id: string) => {
    const updatedItems = foodItems.filter(item => item.id !== id);
    setFoodItems(updatedItems);
    await saveFoodItems(updatedItems);
  };

  const getFoodItemById = (id: string): FoodItem | undefined => {
    return foodItems.find(item => item.id === id);
  };

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        addFoodItem,
        updateFoodItem,
        removeFoodItem,
        getFoodItemById,
        loading,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
} 