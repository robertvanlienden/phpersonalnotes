<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\Note;

final class NoteSerializer
{
    private $notebookSerializer;

    public function __construct(NotebookSerializer $notebookSerializer)
    {
        $this->notebookSerializer = $notebookSerializer;
    }

    public function serialize(Note $note): array
    {
        return [
            'id' => $note->getId(),
            'title' => $note->getTitle(),
            'content' => $note->getContent(),
            'notebook' => $this->notebookSerializer->serialize($note->getNotebook()),
        ];
    }
}
