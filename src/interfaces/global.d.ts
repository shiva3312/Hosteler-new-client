//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserResponse } from '@/interfaces/user.interface'; // Replace with your actual User interface

declare global {
  namespace Express {
    interface Request {
      user: UserResponse;
    }
  }
}
