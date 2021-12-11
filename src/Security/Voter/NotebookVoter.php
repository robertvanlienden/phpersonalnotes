<?php

namespace App\Security\Voter;

use App\Entity\Notebook;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class NotebookVoter extends Voter
{
    public const VIEW = 'view';
    public const EDIT = 'edit';

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT])
            && $subject instanceof Notebook;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Notebook $notebook */
        $notebook = $subject;
        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::VIEW:
            case self::EDIT:
                return $user === $notebook->getUser();
        }

        return false;
    }
}
