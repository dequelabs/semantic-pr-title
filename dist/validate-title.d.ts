interface ValidTitle {
    valid: boolean;
    type: string | null | undefined;
}
export default function isValidTitle(title: string): ValidTitle;
export {};
