import { create } from 'zustand';

export const useBankInfoStore = create(set => ({
  bankAccount: '',
  bankName: '',
  bankAccountHolder: '',
  setBankInfo: ({ bankAccount, bankName, bankAccountHolder }) => set(state => ({
    bankAccount: bankAccount ?? state.bankAccount,
    bankName: bankName ?? state.bankName,
    bankAccountHolder: bankAccountHolder ?? state.bankAccountHolder,
  })),
})); 