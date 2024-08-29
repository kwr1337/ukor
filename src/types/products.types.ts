import type { IBase } from './root.types';

// Интерфейс для ответа, содержащий информацию о членах доски
export interface IProductsResponse extends IBase {
    userId: string; // Идентификатор пользователя
    boardId: string; // Идентификатор доски
    email: string; // Email пользователя (может потребоваться для отображения)
    name: string; // Имя пользователя (может потребоваться для отображения)
}

