import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Html5QrcodePlugin = (props) => {
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    let html5QrCode;

    const createConfig = (props) => {
      const config = {};
      if (props.fps) {
        config.fps = props.fps;
      }
      if (props.qrbox) {
        config.qrbox = props.qrbox;
      }
      if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
      }
      if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
      }
      return config;
    };

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(qrcodeRegionId);
        const config = createConfig(props);

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText, decodedResult) => {
            if (props.qrCodeSuccessCallback) {
              props.qrCodeSuccessCallback(decodedText, decodedResult);
            }
          },
          (errorMessage) => {
            // Ignore errors during scanning
          }
        );
      } catch (err) {
        console.error("Error starting QR scanner:", err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch((err) => {
          console.error("Error stopping QR scanner:", err);
        });
      }
    };
  }, [props]);

  return (
    <div>
      <div id={qrcodeRegionId} style={{ width: '100%' }} />
    </div>
  );
};

export default Html5QrcodePlugin;
