import { UserRole } from '@/data/feature';
import z from 'zod';
import { UserActionResponseZodSchema } from '../common.interface';
import { UserStatus } from '../enums';
import { Primitive } from '../primitive.class';
import { ProfileZodSchema, UserRequestZodSchema } from '../user.interface';

export const SupplierRequestZodSchema = z
  .object({
    role: z.nativeEnum(UserRole).default(UserRole.USER),
    profile: ProfileZodSchema.nullish(),
    status: z.nativeEnum(UserStatus).default(UserStatus.Active), // Assuming status is a UserRole for simplicity,

    // reference fields
    unit: Primitive.safeID().optional(),
    organization: Primitive.safeID().optional(),
  })
  .partial();

export const SupplierResponseZodSchema = z
  .object({
    // auto generated fileds
    _id: Primitive.safeID(),
    scope: Primitive.safeString('Scope').optional(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
  })
  .merge(UserRequestZodSchema)
  .omit({ password: true })
  .extend({
    // extended fields
    parent: z.lazy(() => {
      const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return UserResponseZodSchema.optional();
    }),
    group: z.lazy(() => {
      const GroupResponseZodSchema = require('./group.interface').GroupResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return GroupResponseZodSchema.optional();
    }),
    unit: z.lazy(() => {
      const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return UnitResponseZodSchema.optional();
    }),
    organization: z.lazy(() => {
      const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return OrganizationResponseZodSchema.optional();
    }),
  });

export const UpdateSupplierRequestZodSchema = SupplierRequestZodSchema.partial();

/** Interface  */
export type SupplierRequest = z.infer<typeof SupplierRequestZodSchema>;
export type SupplierResponse = z.infer<typeof SupplierResponseZodSchema>;
export type UpdateSupplierRequest = Partial<z.infer<typeof UpdateSupplierRequestZodSchema>>;
