import Head from "next/head";
import Profile from '@/components/profile';

const Index = () => {
    const fetchTrainees = async (page) => {
        setLoading(true);
        const offset = (page - 1) * limit;

        try {
            const response = await fetch(`/api/trainees?limit=${limit}&offset=${offset}`);
            if (!response.ok) throw new Error("Failed to fetch trainees");

            const data = await response.json();
            setTrainees(data.trainees);
            setTotalPages(Math.ceil(data.totalRows / limit));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Trainee Profile</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@300;400;500;600;700&family=Jost:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Permanent+Marker&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
            </Head>
            <Profile />
        </div>
    );
};

export default Index;