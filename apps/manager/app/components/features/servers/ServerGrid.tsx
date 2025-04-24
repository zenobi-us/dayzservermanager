import { Server } from "@dayzserver/sdk";

import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button";
import { IconPackageImport } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

export function ServerGrid({ servers }: { servers: Server[] }) {
    return (
        <SectionCards>
            <SectionCards.Item
                className="border-dashed border-2 bg-white shadow-none"
                data-slot="empty-card"
                description='Add new server'
                footer={
                    <Button variant='outline'>Create server</Button>
                }
            />
            {servers.map((server) => (
                <ServerCard server={server} />
            ))}
        </SectionCards>

    )
}

function ServerCard({ server }: { server: Server }) {
    const navigate = useNavigate()

    if (server.error) {
        return (
            <SectionCards.Item
                className="cursor-pointer"
                key={server.id}
                title={server.id}
            />
        )
    }
    return (

        <SectionCards.Item
            className="cursor-pointer"
            key={server.id}
            title={server.id}
            description={server.map}
            actions={
                <>
                    <SectionCardBadgeModCount count={server.mods?.length} />
                </>
            }
            onClick={() => {
                navigate({
                    to: '/servers/$serverId',
                    params: {
                        serverId: server.id
                    }
                })
            }}
        />
    )
}

function SectionCardBadgeModCount({ count }: { count?: number }) {

    if (!count || count <= 0) {
        return null
    }

    return (
        <SectionCards.Badge icon={<IconPackageImport />} label={count.toString()} />
    )
}