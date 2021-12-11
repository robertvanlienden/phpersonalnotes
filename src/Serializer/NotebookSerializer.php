<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\Notebook;

final class NotebookSerializer
{
    public function serialize(Notebook $notebook): array
    {
        return [
            'id' => $notebook->getId(),
            'title' => $notebook->getTitle(),
        ];
    }
}
