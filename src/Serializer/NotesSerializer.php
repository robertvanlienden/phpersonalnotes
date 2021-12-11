<?php

declare(strict_types=1);

namespace App\Serializer;

final class NotesSerializer
{
    private $noteSerializer;

    public function __construct(NoteSerializer $noteSerializer)
    {
        $this->noteSerializer = $noteSerializer;
    }

    public function serialize(array $notes): array
    {
        $serializedNotes = [];

        foreach ($notes as $note) {
            $serializedNotes[] = $this->noteSerializer->serialize($note);
        }

        return $serializedNotes;
    }
}
