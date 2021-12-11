<?php

declare(strict_types=1);

namespace App\Serializer;

final class NotebooksSerializer
{
    private $notebookSerializer;

    public function __construct(NotebookSerializer $notebookSerializer)
    {
        $this->notebookSerializer = $notebookSerializer;
    }

    public function serialize(array $notebooks): array
    {
        $serializedNotebooks = [];

        foreach ($notebooks as $notebook) {
            $serializedNotebooks[] = $this->notebookSerializer->serialize($notebook);
        }

        return $serializedNotebooks;
    }
}
