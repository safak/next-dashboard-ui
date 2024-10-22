import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import nodeAPK from 'node-apk';

const getSHA = (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha512');
        const stream = fs.createReadStream(fileName);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
};

const compareVersion = (a: string, b: string): number => {
    const a_arr = a.replace('.apk', '').split('.').map(value => parseInt(value));
    const b_arr = b.replace('.apk', '').split('.').map(value => parseInt(value));
    
    for (let i = 0; i < Math.max(a_arr.length, b_arr.length); i++) {
        const value_a = a_arr[i] || 0;
        const value_b = b_arr[i] || 0;

        if (value_a > value_b) return -1;
        if (value_a < value_b) return 1;
    }
    return 0;
};


export const Appupdate = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const apkDir = path.join(process.cwd(), 'download/android');
        const files = fs.readdirSync(apkDir).filter(file => file !== 'readme.md' && file.charAt(0) !== '.');
        const sortedApkFiles = files.sort(compareVersion);
        
        const appDownloads = [];

        for (const filename of sortedApkFiles) {
            try {
                const apk = new nodeAPK.Apk(path.join(apkDir, filename));
                const manifest = await apk.getManifestInfo();
                apk.close();

                appDownloads.push({
                    version: manifest.versionName,
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/download/android/${filename}`,
                    releaseNotes: `New update ${manifest.versionName}!`,
                    releaseDate: new Date().toISOString(),
                    sha512: await getSHA(path.join(apkDir, filename)),
                });
            } catch (error) {
                console.error(error);
            }
        }

        res.status(200).json(appDownloads);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
