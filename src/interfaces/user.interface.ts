//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { UserRole } from '@/data/feature';

import { dataZodSchema } from './common.interface';
import {
  Religion,
  CasteCategory,
  Gender,
  FoodPreference,
  BloodGroup,
  DeviceType,
} from './enums';

export const ContactZodSchema = z.object({
  email: z.string().email('Email address').nullish(),
  phone: z.string().nullish(),
  alternatePhone: z.string().nullish(),
  emergencyPhone: z.string().nullish(),
  facebookAccount: z.string().nullish(),
  instagramAccount: z.string().nullish(),
  linkedinAccount: z.string().nullish(),
  twitterAccount: z.string().nullish(),
  githubAccount: z.string().nullish(),
});

export const AddressZodSchema = z.object({
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  city: z.string().nullish(),
  district: z.string().nullish(),
  subDistrict: z.string().nullish(),
  post: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  postalCode: z.number().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  addressType: z.string().nullish(),
  landmark: z.string().nullish(),
});

export const IdentityZodSchema = z.object({
  passportNumber: z.string().nullish(),
  nationalId: z.string().nullish(),
  voterId: z.string().nullish(),
  panCard: z.string().nullish(),
  aadharCard: z.string().nullish(),
  drivingLicense: z.string().nullish(),
  rationCard: z.string().nullish(),
  healthCard: z.string().nullish(),
  birthCertificate: z.string().nullish(),
});

export const FinanceZodSchema = z.object({
  bankName: z.string().nullish(),
  branchName: z.string().nullish(),
  accountNumber: z.string().nullish(),
  ifscCode: z.string().nullish(),
  swiftCode: z.string().nullish(),
  accountType: z.string().nullish(),
  accountHolderName: z.string().nullish(),
  accountHolderDob: dataZodSchema.nullish(),
  accountHolderGender: z.nativeEnum(Gender),
  taxIdentificationNumber: z.string().nullish(),
});

export const MedicalZodSchema = z.object({
  bloodGroup: z.nativeEnum(BloodGroup),
  allergies: z.string().nullish(),
});

export const PreferencesZodSchema = z.object({
  preferredLanguage: z.string().nullish(),
  preferredCurrency: z.string().nullish(),
  preferredTimezone: z.string().nullish(),
  preferredDateFormat: z.string().nullish(),
  preferredTimeFormat: z.string().nullish(),
  foodPreference: z.nativeEnum(FoodPreference),
});

export const TechInfoZodSchema = z.object({
  ipAddress: z.string().ip(),
  deviceType: z.nativeEnum(DeviceType),
  osType: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
});

export const ProfileZodSchema = z.object({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  bio: z.string().nullish(),
  imageUrl: z.string().nullish(),
  dob: dataZodSchema.nullish(),
  gender: z.nativeEnum(Gender),
  religion: z.nativeEnum(Religion).nullish(),
  casteCategory: z.nativeEnum(CasteCategory).nullish(),
  address: AddressZodSchema,
  contacts: ContactZodSchema.nullish(),
  preferences: PreferencesZodSchema.nullish(),
  medical: MedicalZodSchema.nullish(),
  finance: FinanceZodSchema.nullish(),
  identity: IdentityZodSchema.nullish(),
  techInfo: TechInfoZodSchema.nullish(),
});

export const UserRequestZodSchema = z.object({
  username: z.string().nullish(),
  password: z.string().nullish(),
  role: z.nativeEnum(UserRole).nullish(),
  profile: ProfileZodSchema.optional(),

  // reference fields
  groupId: z.string().nullish(),
  unitId: z.string().nullish(),
  organizationId: z.string().nullish(),
});

export const UserResponseZodSchema = z
  .object({
    // auto generated fileds
    _id: z.string(),
    createdAt: dataZodSchema,
    updatedAt: dataZodSchema,
  })
  .merge(UserRequestZodSchema)
  .omit({ password: true, groupId: true, unitId: true, organizationId: true })
  .extend({
    // extended fields
    group: z.lazy(() => {
      const GroupResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./group.interface').GroupResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return GroupResponseZodSchema.optional();
    }),
    unit: z.lazy(() => {
      const UnitResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return UnitResponseZodSchema.optional();
    }),
    organization: z.lazy(() => {
      const OrganizationsResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./organization.interface').OrganizationsResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return OrganizationsResponseZodSchema.optional();
    }),
  });

export const UpdateUserRequestZodSchema = UserRequestZodSchema.partial();

/** Interface  */
export type Contact = z.infer<typeof ContactZodSchema>;
export type Address = z.infer<typeof AddressZodSchema>;
export type Identity = z.infer<typeof IdentityZodSchema>;
export type Finance = z.infer<typeof FinanceZodSchema>;
export type UserRequest = z.infer<typeof UserRequestZodSchema>;
export type UserResponse = z.infer<typeof UserResponseZodSchema>;
export type UpdateUserRequest = Partial<
  z.infer<typeof UpdateUserRequestZodSchema>
>;
