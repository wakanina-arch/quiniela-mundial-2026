export const useToast = () => ({
  toast: (props: any) => console.log("Toast:", props),
  dismiss: () => {},
})
export const toast = (props: any) => console.log("Toast:", props)
