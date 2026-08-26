'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function MemberQRCode({ value, size = 96 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      className="w-full h-full"
    />
  );
}
