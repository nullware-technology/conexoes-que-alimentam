export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  image?: string;
  type: 'ONG' | 'Campanha' | 'Instituição Beneficente' | 'Iniciativa Comunitária' | 'Projeto Animal' | 'Instituição';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    name: 'ONG Mãos que Alimentam',
    type: 'ONG',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    lastMessage: 'Olá! Como podemos ajudar?',
    lastMessageTime: '10:30',
    unreadCount: 2,
    messages: [
      {
        id: 'msg1-1',
        message: 'Olá! Como podemos ajudar com doações?',
        isUser: false,
        timestamp: '2024-07-28T10:30:00Z'
      },
      {
        id: 'msg1-2',
        message: 'Gostaria de saber quais itens vocês mais precisam atualmente.',
        isUser: true,
        timestamp: '2024-07-28T10:31:00Z'
      },
      {
        id: 'msg1-3',
        message: 'No momento, nossa maior necessidade é de alimentos não perecíveis e produtos de higiene pessoal. Qualquer ajuda é bem-vinda!',
        isUser: false,
        timestamp: '2024-07-28T10:32:00Z'
      },
      {
        id: 'msg1-4',
        message: 'Entendido! Posso levar na quarta-feira à tarde?',
        isUser: true,
        timestamp: '2024-07-28T10:33:00Z'
      }
    ]
  },
  {
    id: 'chat2',
    name: 'Campanha Natal Solidário 2024',
    type: 'Campanha',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1512389141490-3aa3491ba7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    lastMessage: 'Ainda estamos recebendo doações?',
    lastMessageTime: '09:15',
    unreadCount: 0,
    messages: [
      {
        id: 'msg2-1',
        message: 'Olá! Gostaria de doar brinquedos para a campanha de Natal. Ainda é possível?',
        isUser: true,
        timestamp: '2024-07-28T09:15:00Z'
      },
      {
        id: 'msg2-2',
        message: 'Sim, claro! Estamos recebendo doações até o dia 20 de Dezembro no Ginásio Municipal. Muito obrigado pelo seu interesse!',
        isUser: false,
        timestamp: '2024-07-28T09:16:00Z'
      },
      {
        id: 'msg2-3',
        message: 'Perfeito! Levarei na próxima semana.',
        isUser: true,
        timestamp: '2024-07-28T09:17:00Z'
      }
    ]
  },
  {
    id: 'chat3',
    name: 'Instituto Bom Samaritano',
    type: 'Instituição Beneficente',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1580893246090-c40278eda413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    lastMessage: 'Precisamos de voluntários para o próximo fim de semana',
    lastMessageTime: 'Ontem',
    unreadCount: 1,
    messages: [
      {
        id: 'msg3-1',
        message: 'Bom dia! Vi que vocês precisam de fraldas geriátricas. Tenho alguns pacotes para doar.',
        isUser: true,
        timestamp: '2024-07-27T15:30:00Z'
      },
      {
        id: 'msg3-2',
        message: 'Olá, bom dia! Que ótima notícia! Sim, estamos precisando muito. Pode entregar diretamente na recepção do instituto.',
        isUser: false,
        timestamp: '2024-07-27T15:31:00Z'
      },
      {
        id: 'msg3-3',
        message: 'Vocês também aceitam voluntários para conversar com os idosos?',
        isUser: true,
        timestamp: '2024-07-27T15:32:00Z'
      },
      {
        id: 'msg3-4',
        message: 'Aceitamos sim! Temos um programa de voluntariado bem legal. Posso te passar mais informações?',
        isUser: false,
        timestamp: '2024-07-27T15:33:00Z'
      }
    ]
  },
  {
    id: 'chat4',
    name: 'Cozinha Comunitária Sabor & Afeto',
    type: 'Iniciativa Comunitária',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1578501000916-3d5fd9cf460c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    lastMessage: 'Posso doar legumes na terça?',
    lastMessageTime: 'Hoje 11:00',
    unreadCount: 0,
    messages: [
      {
        id: 'msg4-1',
        message: 'Olá, gostaria de doar alguns legumes e verduras. Vocês aceitam na terça-feira?',
        isUser: true,
        timestamp: '2024-07-28T11:00:00Z'
      },
      {
        id: 'msg4-2',
        message: 'Oi! Aceitamos sim, nas terças e quintas, das 10h às 12h. Será muito bem-vindo!',
        isUser: false,
        timestamp: '2024-07-28T11:01:00Z'
      }
    ]
  },
  {
    id: 'chat5',
    name: 'Projeto Patas & Pratos',
    type: 'Projeto Animal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    lastMessage: 'Tenho ração para doar!',
    lastMessageTime: 'Hoje 14:20',
    unreadCount: 3,
    messages: [
      {
        id: 'msg5-1',
        message: 'Oi! Tenho um pacote grande de ração para cães filhotes que meu cachorro não se adaptou. Vocês aceitam?',
        isUser: true,
        timestamp: '2024-07-28T14:20:00Z'
      },
      {
        id: 'msg5-2',
        message: 'Olá! Aceitamos sim, com certeza! Pode deixar no PetShop Amigo Fiel, nosso ponto de coleta.',
        isUser: false,
        timestamp: '2024-07-28T14:21:00Z'
      },
      {
        id: 'msg5-3',
        message: 'E medicamentos veterinários dentro da validade, vocês também pegam?',
        isUser: true,
        timestamp: '2024-07-28T14:22:00Z'
      },
      {
        id: 'msg5-4',
        message: 'Sim, desde que estejam lacrados e dentro da validade, são muito úteis!',
        isUser: false,
        timestamp: '2024-07-28T14:23:00Z'
      }
    ]
  }
]; 