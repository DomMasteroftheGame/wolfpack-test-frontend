import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { packApi } from '../api';

interface CreatePackFormProps {
    token: string;
    onSuccess: (pack: any) => void;
}

const CreatePackForm: React.FC<CreatePackFormProps> = ({ token, onSuccess }) => {
    const [name, setName] = useState('');
    const [mission, setMission] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const pack = await packApi.createPack(token, name, mission);
            onSuccess(pack);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create pack');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">Form a New Wolfpack</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="packName" className="text-white">Pack Name</Label>
                        <Input
                            id="packName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. The Nightstalkers"
                            required
                            className="bg-slate-950 border-slate-700 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mission" className="text-white">Mission Objective</Label>
                        <Textarea
                            id="mission"
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            placeholder="What is your startup's primary goal?"
                            className="bg-slate-950 border-slate-700 text-white min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                        disabled={loading}
                    >
                        {loading ? 'Initializing Protocol...' : 'Establish Pack'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default CreatePackForm;
