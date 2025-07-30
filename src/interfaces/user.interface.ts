//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { UserRole } from '@/data/feature';

import {
  MetaZodSchema,
  PasswordZodSchema,
  UserActionResponseZodSchema,
  UsernameZodSchema,
} from './common.interface';
import {
  Religion,
  CasteCategory,
  Gender,
  MealType,
  BloodGroup,
  DeviceType,
  UserStatus,
  MealStatus,
} from './enums';
import { Primitive } from './primitive.class';

export const ContactZodSchema = z.object({
  email: Primitive.safeEmail().nullish(),
  phone: Primitive.safePhoneNumber('Phone number').nullish(),
  alternatePhone: Primitive.safePhoneNumber('Alternate phone number').nullish(),
  emergencyPhone: Primitive.safePhoneNumber('Emergency phone number').nullish(),
  facebookAccount: Primitive.safeURL('Facebook', [
    'https://www.facebook.com',
  ]).nullish(),
  instagramAccount: Primitive.safeString('Instagram', [
    'https://www.instagram.com',
  ]).nullish(),
  linkedinAccount: Primitive.safeString('Linkedin', [
    'https://www.linkedin.com',
  ]).nullish(),
  twitterAccount: Primitive.safeString('Twitter', [
    'https://www.twitter.com',
  ]).nullish(),
  githubAccount: Primitive.safeURL('Github', [
    'https://www.github.com',
  ]).nullish(),
});

export const AddressZodSchema = z.object({
  addressLine1: Primitive.safeString('Address Line 1', [], 3, 50).nullish(),
  addressLine2: Primitive.safeString('Address Line 2', [], 3, 50).nullish(),
  city: Primitive.safeString('City', [], 3, 30).nullish(),
  district: Primitive.safeString('District', [], 3, 30).nullish(),
  subDistrict: Primitive.safeString('Sub-District', [], 3, 30).nullish(),
  post: Primitive.safeString('Post', [], 3, 30).nullish(),
  state: Primitive.safeString('State', [], 3, 30).nullish(),
  country: Primitive.safeString('Country', [], 3, 30).nullish(),
  postalCode: Primitive.safeNumber('Postal Code', 6, 6).nullish(),
  latitude: Primitive.safeNumber('Latitude').nullish(),
  longitude: Primitive.safeNumber('Longitude').nullish(),
  addressType: Primitive.safeString('Address Type').nullish(),
  landmark: Primitive.safeString('Landmark').nullish(),
});

export const IdentityZodSchema = z.object({
  passportNumber: Primitive.safeString('Passport Number', [], 3, 30).nullish(),
  nationalId: Primitive.safeString('National ID', [], 3, 30).nullish(),
  voterId: Primitive.safeString('Voter ID', [], 3, 30).nullish(),
  panCard: Primitive.safeString('PAN Card', [], 3, 30).nullish(),
  aadharCard: Primitive.safeString('Aadhar Card', [], 3, 30).nullish(),
  drivingLicense: Primitive.safeString('Driving License', [], 3, 30).nullish(),
  rationCard: Primitive.safeString('Ration Card', [], 3, 30).nullish(),
  healthCard: Primitive.safeString('Health Card', [], 3, 30).nullish(),
  birthCertificate: Primitive.safeString(
    'Birth Certificate',
    [],
    3,
    30,
  ).nullish(),
});

export const FinanceZodSchema = z.object({
  bankName: Primitive.safeString('Bank Name', [], 3, 30).nullish(),
  branchName: Primitive.safeString('Branch Name', [], 3, 30).nullish(),
  accountNumber: Primitive.safeString('Account Number', [], 3, 30).nullish(),
  ifscCode: Primitive.safeString('IFSC Code', [], 3, 30).nullish(),
  swiftCode: Primitive.safeString('SWIFT Code', [], 3, 30).nullish(),
  accountType: Primitive.safeString('Account Type', [], 3, 30).nullish(),
  accountHolderName: Primitive.safeString(
    'Account Holder Name',
    [],
    3,
    30,
  ).nullish(),
  accountHolderDob: Primitive.safeDate('Account Holder DOB').nullish(),
  accountHolderGender: z.nativeEnum(Gender).nullish(),
  taxIdentificationNumber: Primitive.safeString(
    'Tax Identification Number',
    [],
    3,
    30,
  ).nullish(),
});

export const MedicalZodSchema = z.object({
  bloodGroup: z.nativeEnum(BloodGroup).nullish(),
  allergies: Primitive.safeString('Allergies', [], 3, 30).nullish(),
});

export const PreferencesZodSchema = z.object({
  preferredLanguage: Primitive.safeString(
    'Preferred Language',
    [],
    2,
    20,
  ).nullish(),
  preferredCurrency: Primitive.safeString(
    'Preferred Currency',
    [],
    2,
    10,
  ).nullish(),
  preferredTimezone: Primitive.safeString(
    'Preferred Timezone',
    [],
    2,
    50,
  ).nullish(),
  preferredDateFormat: Primitive.safeString(
    'Preferred Date Format',
    [],
    2,
    20,
  ).nullish(),
  preferredTimeFormat: Primitive.safeString(
    'Preferred Time Format',
    [],
    2,
    20,
  ).nullish(),
  mealType: z.nativeEnum(MealType),
});

export const TechInfoZodSchema = z.object({
  ipAddress: z.string().ip().nullish(),
  deviceType: z.nativeEnum(DeviceType).nullish(),
  osType: Primitive.safeString('Preferred Language', [], 2, 20).nullish(),
  latitude: Primitive.safeNumber('Latitude').nullish(),
  longitude: Primitive.safeNumber('Longitude').nullish(),
});

export const ProfileZodSchema = z.object({
  firstName: Primitive.safeString().nullish(),
  lastName: Primitive.safeString().nullish(),
  bio: Primitive.safeString().nullish(),
  dob: Primitive.safeDate().nullish(),
  gender: z.nativeEnum(Gender).nullish(),
  religion: z.nativeEnum(Religion).nullish(),
  casteCategory: z.nativeEnum(CasteCategory).nullish(),
  address: AddressZodSchema.nullish(),
  contacts: ContactZodSchema.nullish(),
  preferences: PreferencesZodSchema.nullish(),
  medical: MedicalZodSchema.nullish(),
  finance: FinanceZodSchema.nullish(),
  identity: IdentityZodSchema.nullish(),
  techInfo: TechInfoZodSchema.nullish(),
  education: z
    .array(
      z.object({
        institution: Primitive.safeString('Institution', [], 3, 50).nullish(),
        degree: Primitive.safeString('Degree', [], 3, 50).nullish(),
        fieldOfStudy: Primitive.safeString(
          'Field of Study',
          [],
          3,
          50,
        ).nullish(),
        startDate: Primitive.safeDate('Start Date').nullish(),
        endDate: Primitive.safeDate('End Date').nullish(),
        grade: Primitive.safeString('Grade', [], 3, 10).nullish(),
        description: Primitive.safeString('Description', [], 3, 200).nullish(),
      }),
    )
    .nullish(),
  workExperience: z
    .array(
      z.object({
        company: Primitive.safeString('Company', [], 3, 50).nullish(),
        position: Primitive.safeString('Position', [], 3, 50).nullish(),
        startDate: Primitive.safeDate('Start Date').nullish(),
        endDate: Primitive.safeDate('End Date').nullish(),
        responsibilities: Primitive.safeString(
          'Responsibilities',
          [],
          3,
          200,
        ).nullish(),
      }),
    )
    .nullish(),
});

export const UserRequestZodSchema = z.object({
  username: UsernameZodSchema,
  password: PasswordZodSchema.nullish(),
  imageUrl: Primitive.safeString().nullish(),
  roles: z.array(z.nativeEnum(UserRole)).default([UserRole.USER]), // Default to USER role, can be extended with more roles
  profile: ProfileZodSchema.nullish(),
  status: z.nativeEnum(UserStatus).default(UserStatus.Active), // Assuming status is a UserRole for simplicity,
  mealStatus: z.nativeEnum(MealStatus).default(MealStatus.Active), // Assuming mealStatus is a UserRole for simplicity,
  isChangePassword: z.boolean().default(false), // Indicates if the user is changing their password
  room: Primitive.safeString('Room').nullish(),
  isVerified: z.boolean().nullish().default(false), // Indicates if the user is verified

  // reference fields
  parent: Primitive.safeID().nullish(), // Parent user ID for hierarchical relationships, Guest user mush have a parent
  group: Primitive.safeID().nullish(),
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const UserResponseZodSchema = z
  .object({
    // auto generated fileds
    _id: Primitive.safeID(),
    scope: Primitive.safeString('Scope').nullish(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(),
  })
  .merge(UserRequestZodSchema)
  .omit({ password: true })
  .extend({
    meta: MetaZodSchema.optional(),
    permissions: z.array(Primitive.safeString('Permission')).optional(),
    // extended fields
    // parent: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UserResponseZodSchema.optional();
    // }),
    // group: z.lazy(() => {
    //   const GroupResponseZodSchema = require('./group.interface').GroupResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return GroupResponseZodSchema.optional();
    // }),
    // unit: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UnitResponseZodSchema.optional();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return OrganizationResponseZodSchema.optional();
    // }),
  });

export const ImageUploadRequestZodSchema = z.object({
  mimetype: Primitive.safeString('Image').refine(
    (mimetype) => ['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype),
    {
      message: 'Invalid file type. Only JPEG and PNG are allowed.',
    },
  ),
  size: z
    .number()
    .max(5 * 1024 * 1024, { message: 'File size must not exceed 5MB.' }), // Max size: 5MB
  originalname: Primitive.safeString('Image', [], 1, 20),
});

export const ImageUploadResponseZodSchema = ImageUploadRequestZodSchema.extend({
  meta: MetaZodSchema.optional(),
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
export type ImageUploadRequest = z.infer<typeof ImageUploadRequestZodSchema>;
export type ImageUploadResponse = z.infer<typeof ImageUploadResponseZodSchema>;
